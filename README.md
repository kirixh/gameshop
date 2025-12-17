# gameshop

Клиент-серверное приложение на Django + React. Это онлайн-магазин компьютерных игр.

Можно добавлять игры в «Желаемое», следить за ачивками и временем в каждой игре. Также можно покупать игры. Поддержана авторизация.

## Запустить можно локально и через docker:

### Docker
* docker compose up -d в корне проекта

### Локально:
* В папке front - npm start;
* В папке back:
  * Желательно создать venv, в нем выполнить pip install --no-cache-dir -r requirements.txt
  * python manage.py migrate
  * python manage.py runserver 8000