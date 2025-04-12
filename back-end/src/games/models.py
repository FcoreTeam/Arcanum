from tortoise import Model, fields
from uuid import uuid4

class Game(Model):
    id = fields.UUIDField(default=uuid4, primary_key=True)
    name = fields.CharField(max_length=255)
    description = fields.CharField(max_length=255)
    date = fields.DateField()
    price = fields.DecimalField(max_digits=100, decimal_places=2)
    photo_message_id = fields.BigIntField(max_length=255)
    video_message_id = fields.BigIntField()
    answer = fields.CharField(max_length=255)
    is_test = fields.BooleanField()
    owner: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField("models.User", related_name="games")
    tips: fields.ReverseRelation["GameTip"]

    class Meta:
        table = "games"

    def __str__(self):
        return f"<{self.id, self.name, self.owner.id}>"

class GameTip(Model):
    id = fields.UUIDField(default=uuid4, primary_key=True)
    content = fields.TextField()
    game: fields.ForeignKeyRelation[Game] = fields.ForeignKeyField("models.Game", related_name="tips")

    class Meta:
        table = "game_tips"
    
    def __str__(self):
        return f"<{self.id} {self.content}>"


