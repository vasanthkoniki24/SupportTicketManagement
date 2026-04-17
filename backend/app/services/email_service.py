import smtplib
from email.mime.text import MIMEText
from app.core.config import settings


def send_email(to_email: str, subject: str, body: str):
    print("EMAIL DEBUG -> starting send_email()")
    print("EMAIL DEBUG -> SMTP_HOST:", settings.SMTP_HOST)
    print("EMAIL DEBUG -> SMTP_PORT:", settings.SMTP_PORT)
    print("EMAIL DEBUG -> SMTP_USERNAME:", settings.SMTP_USERNAME)
    print("EMAIL DEBUG -> EMAIL_FROM:", settings.EMAIL_FROM)
    print("EMAIL DEBUG -> TO:", to_email)

    if not all([
        settings.SMTP_HOST,
        settings.SMTP_PORT,
        settings.SMTP_USERNAME,
        settings.SMTP_PASSWORD,
        settings.EMAIL_FROM,
    ]):
        print("EMAIL DEBUG -> Missing SMTP settings, email not sent")
        return

    try:
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = to_email

        server = smtplib.SMTP(settings.SMTP_HOST, int(settings.SMTP_PORT))
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(settings.EMAIL_FROM, [to_email], msg.as_string())
        server.quit()

        print("EMAIL DEBUG -> Email sent successfully")
    except Exception as e:
        print("EMAIL DEBUG -> Email failed:", str(e))