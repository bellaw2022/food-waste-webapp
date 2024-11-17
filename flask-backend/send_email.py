from datetime import datetime, timedelta
from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker, declarative_base
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from collections import defaultdict
from models import db, Produce, UserAndProduce, User

# Database Configuration
DATABASE_URL = "postgresql://u1918j60ppob87:p02d261c522b0470df0fb0436896a979290bb230d174839d6b54fad0eb37cb9b2@cfls9h51f4i86c.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/dd1ihmcjpvu36e"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class EmailSender:
    def __init__(self, smtp_server, smtp_port, username, password):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.username = username
        self.password = password

    def create_message(self, subject, from_addr, to_addr, body, html=None):
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = from_addr
        msg["To"] = to_addr

        msg.attach(MIMEText(body, "plain", "utf-8"))
        if html:
            msg.attach(MIMEText(html, "html", "utf-8"))
        return msg

    def send(self, msg):
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.username, self.password)
            server.send_message(msg)


def get_expiring_items(db):
    """Get items expiring in the next 4 days and organize them by user"""
    today = datetime.now().date()
    four_days_later = today + timedelta(days=4)

    # Query for expiring items with user and produce information
    expiring_items = (
        db.query(UserAndProduce, User, Produce)
        .join(User, UserAndProduce.user_id == User.user_id)
        .join(Produce, UserAndProduce.produce_id == Produce.produce_id)
        .filter(
            and_(
                UserAndProduce.expiration_date >= today,
                UserAndProduce.expiration_date <= four_days_later,
            )
        )
        .all()
    )

    # Organize items by user
    user_items = defaultdict(list)
    for user_produce, user, produce in expiring_items:
        user_items[user].append(
            {
                "produce_name": produce.produce_name,
                "quantity": user_produce.quantity,
                "unit": produce.unit,
                "expiration_date": user_produce.expiration_date,
                "co2": produce.co2,
            }
        )
    # print(user_items)
    return user_items


def generate_email_content(items, user):
    user_name = user.username.split()[0] if user.username else "there"
    plural = "s" if len(items) > 1 else ""
    """Generate email content for a user's expiring items"""
    body = "The following items in your inventory are expiring soon:\n\n"
    html = """
    <html>
    <head>
        <style>
        table {{
            border-collapse: collapse;
            width: 100%;
        }}
        th, td {{
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{
            background-color: #f2f2f2;
        }}
        tr:hover {{
            background-color: #f9f9f9;
        }}
        h2 {{
            color: #333;
        }}
        p {{
            font-size: 14px;
            color: #555;
        }}
        </style>
    </head>
    <body>
        <h2>Hi {0}, we wanted to remind you about your expiring item{1}!</h2>
        <table>
        <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Expiration Date</th>
            <th>Days Remaining</th>
            <th>Total CO2 Cost (kg)</th>
        </tr>
    """.format(
        user_name, plural
    )

    # Add items to both plain text and HTML content
    for item in items:
        body += f"- {item['produce_name']}: {item['quantity']} units, expires on {item['expiration_date']}\n"
        unit = item["unit"] if item["unit"] else "unit"
        html += f"""
          <tr>
            <td>{item['produce_name'].title()}</td>
            <td>{item['quantity']}</td>
            <td>{unit}</td>
            <td>{item['expiration_date']}</td>
            <td>{(item['expiration_date'] - datetime.now().date()).days}</td>
            <td>{(item['co2'] * item['quantity']) / 1000:.2f}</td>
          </tr>
        """

    html += """
        </table>
        <p>Log in to your Fridgify account to explore ways to use these items before they expire!</p>
      </body>
    </html>
    """

    return body, html


def send_expiry_notifications():
    # Database session
    db = SessionLocal()

    try:
        # Email sender configuration
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        username = "bellawutamu@gmail.com"
        password = "cpvk xxrg bert iwjq"

        # Create email sender
        sender = EmailSender(smtp_server, smtp_port, username, password)

        # Get expiring items organized by user
        user_items = get_expiring_items(db)

        # Send notifications to each user
        for user, items in user_items.items():
            # deleteme
            # if user.username != "Griffin Beaudreau":
            #     continue
            # Generate email content
            body, html = generate_email_content(items, user)

            # Create and send email
            subject = "Food Expiry Notification"
            msg = sender.create_message(
                subject=subject,
                from_addr=username,
                to_addr=user.email,
                body=body,
                html=html,
            )

            try:
                sender.send(msg)
                print(f"Notification sent successfully to {user.email}")
            except Exception as e:
                print(f"Error sending notification to {user.email}: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    send_expiry_notifications()
