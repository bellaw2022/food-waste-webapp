#!/bin/bash
# crontab -e
# 0 16 * * 0,3 <PATH TO weekly_expiry_notification.sh>
# the notification will be sent each Wed, Sun on 4pm


PYTHON_SCRIPT="./send_email.py"

LOG_FILE="./weekly_script.log"

mkdir -p "$(dirname "$LOG_FILE")"

run_script() {
    echo "=== Script started at $(date) ===" >> "$LOG_FILE"

    source ./venv/bin/activate

    python3 "$PYTHON_SCRIPT" >> "$LOG_FILE" 2>&1

    echo "=== Script finished at $(date) ===" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
}

run_script