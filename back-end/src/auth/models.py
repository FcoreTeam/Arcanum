from tortoise import Model, fields

from uuid import uuid4

class User(Model):
    id = fields.UUIDField(default=uuid4, primary_key=True)
    telegram_id = fields.BigIntField()
    balance = fields.DecimalField(max_digits=100, decimal_places=2, default=0.00)
    is_admin = fields.BooleanField(default=False)
    email = fields.CharField(max_length=255, null=True)
    phone = fields.CharField(max_length=255, null=True)
    avatar_url = fields.CharField(max_length=255, null=True)
    first_name = fields.CharField(max_length=255, null=True)
    username = fields.CharField(max_length=255, null=True)
    games: fields.ReverseRelation["Game"]
    results: fields.ReverseRelation["GameResult"]

    class Meta:
        table = "users"

    def __str__(self):
        return f"<{self.id} {self.username or self.first_name} {self.telegram_id} {'admin' if self.is_admin else 'default'}>"

