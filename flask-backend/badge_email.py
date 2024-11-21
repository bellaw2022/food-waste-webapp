import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from models import User

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


def generate_badge_email_content(user):
    """Generate email content for badge achievement."""
    user_name = user.username.split()[0] if user.username else "there"

    body = f"""
    Congratulations, {user_name}!
    You’ve earned a new badge for your environmental achievements. Keep up the amazing work!
    """

    html = f"""
    <html>
    <head>
        <style>
        .badge {{
            text-align: left;
            margin: 20px 0;
        }}
        </style>
    </head>
    <body>
        <div class="badge">
            <img src="cid:badge" alt="Environmental Badge" width="200" height="200" />
        </div>
        <h2>Congratulations, {user_name}!</h2>
        <p>You’ve earned a new badge for your environmental achievements!</p>
        <p>Keep up the amazing work and continue making a difference for our planet!</p>
    </body>
    </html>
    """
    return body, html


def send_badge_email(user):
    """Send email for badge achievement."""
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    username = "bellawutamu@gmail.com"
    password = "cpvk xxrg bert iwjq"

    sender = EmailSender(smtp_server, smtp_port, username, password)

    # Generate badge email content
    body, html = generate_badge_email_content(user)

    # Create message with inline image for the badge
    msg = sender.create_message(
        subject="Congratulations on Your New Environmental Badge!",
        from_addr=username,
        to_addr=user.email,
        body=body,
        html=html,
    )

    # Add badge image inline
    with open("badge.png", "rb") as badge_file:
        msg_image = MIMEText(badge_file.read(), "base64", "utf-8")
        msg_image.add_header("Content-ID", "<badge>")
        msg_image.add_header("Content-Disposition", "inline", filename="badge.png")
        msg.attach(msg_image)

    # Send the email
    try:
        sender.send(msg)
        print(f"Badge email sent successfully to {user.email}")
    except Exception as e:
        print(f"Error sending badge email to {user.email}: {e}")
