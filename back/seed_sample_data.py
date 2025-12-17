from decimal import Decimal

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from games.models import Category, Games
from achievements.models import Achievements
from users.models import Statistics, UserProfile, Wishlist


# Очистка данных (dev-use only)
Wishlist.objects.all().delete()
Statistics.objects.all().delete()
Achievements.objects.all().delete()
Games.objects.all().delete()
Category.objects.all().delete()

# Пользователь
demo, _ = User.objects.get_or_create(
    username="demo",
    defaults={"email": "demo@example.com", "password": make_password("demo12345")}
)
profile, _ = UserProfile.objects.get_or_create(user=demo)
profile.balance = Decimal("3000.00")
profile.save(update_fields=["balance"])

# Категории
action = Category.objects.create(title="Action")
rpg = Category.objects.create(title="RPG")
puzzle = Category.objects.create(title="Puzzle")
strategy = Category.objects.create(title="Strategy")
adventure = Category.objects.create(title="Adventure")

games_payload = [
    {
        "name": "Portal 2",
        "description": "Кооперативные головоломки от Valve",
        "category": puzzle,
        "photo": "photos/portal2.jpg",
        "price": Decimal("999.00"),
    },
    {
        "name": "The Witcher 3",
        "description": "RPG про ведьмака",
        "category": rpg,
        "photo": "photos/witcher3.jpg",
        "price": Decimal("1599.00"),
    },
    {
        "name": "DOOM Eternal",
        "description": "Быстрый шутер про демонов",
        "category": action,
        "photo": "photos/doom.jpg",
        "price": Decimal("1999.00"),
    },
    {
        "name": "Stardew Valley",
        "description": "Ферма и приключения в пиксельном мире",
        "category": adventure,
        "photo": "photos/stardewvalley.png",
        "price": Decimal("699.00"),
    },
    {
        "name": "Civilization VI",
        "description": "Пошаговая стратегия про построение империи",
        "category": strategy,
        "photo": "photos/civilization6.jpeg",
        "price": Decimal("1799.00"),
    },
    {
        "name": "Hades",
        "description": "Рогалик с мифологией и динамичными боями",
        "category": action,
        "photo": "photos/hades.png",
        "price": Decimal("1299.00"),
    },
]

# Создание игр
created_games = {}
for payload in games_payload:
    game = Games.objects.create(**payload)
    created_games[game.name] = game

# Ачивки
Achievements.objects.create(game=created_games["Portal 2"], title="Test Chamber Master", description="Пройди все тесты")
Achievements.objects.create(game=created_games["The Witcher 3"], title="Brawler", description="Выиграй кулачный бой")
Achievements.objects.create(game=created_games["DOOM Eternal"], title="Ultra Nightmare", description="Закрой кампанию на Ultra-Nightmare")

# Покупки демо-пользователя (часть игр)
Statistics.objects.create(user=demo, game=created_games["Portal 2"], achievements="Test Chamber Master", spent_hours=12)
Statistics.objects.create(user=demo, game=created_games["The Witcher 3"], achievements="Brawler", spent_hours=80)
Statistics.objects.create(user=demo, game=created_games["DOOM Eternal"], achievements="Ultra Nightmare", spent_hours=25)

# Вишлист для игр без покупки
Wishlist.objects.create(user=demo, game=created_games["Civilization VI"])

print("Seed done")
