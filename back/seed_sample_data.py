from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from games.models import Category, Games
from achievements.models import Achievements
from users.models import Statistics

Statistics.objects.all().delete()
Achievements.objects.all().delete()
Games.objects.all().delete()
Category.objects.all().delete()

# Пользователи
demo, _ = User.objects.get_or_create(
    username="demo",
    defaults={"email": "demo@example.com", "password": make_password("demo12345")}
)

# Категории
action, _ = Category.objects.get_or_create(title="Action")
rpg, _ = Category.objects.get_or_create(title="RPG")
puzzle, _ = Category.objects.get_or_create(title="Puzzle")

# Игры
portal2, _ = Games.objects.get_or_create(
    name="Portal 2",
    defaults={
        "description": "Кооперативные головоломки от Valve",
        "category": puzzle,
        "photo": "photos/portal2.jpg"
        }
)
witcher3, _ = Games.objects.get_or_create(
    name="The Witcher 3",
    defaults={
        "description": "RPG про ведьмака",
        "category": rpg,
        "photo": "photos/witcher3.jpg"
        }
)
doom, _ = Games.objects.get_or_create(
    name="DOOM Eternal",
    defaults={
        "description": "Быстрый шутер про демонов",
        "category": action,
        "photo": "photos/doom.jpg"
        }
)

# Ачивки
Achievements.objects.get_or_create(game=portal2, title="Test Chamber Master", defaults={"description": "Пройди все тесты"})
Achievements.objects.get_or_create(game=witcher3, title="Brawler", defaults={"description": "Выиграй кулачный бой"})
Achievements.objects.get_or_create(game=doom, title="Ultra Nightmare", defaults={"description": "Закрой кампанию на Ultra-Nightmare"})

# Статистика демо-пользователя
Statistics.objects.get_or_create(
    user=demo,
    game=portal2,
    defaults={"achievements": "Test Chamber Master", "spent_hours": 12}
)
Statistics.objects.get_or_create(
    user=demo,
    game=witcher3,
    defaults={"achievements": "Brawler", "spent_hours": 80}
)
Statistics.objects.get_or_create(
    user=demo,
    game=doom,
    defaults={"achievements": "Ultra Nightmare", "spent_hours": 25}
)

print("Seed done")
