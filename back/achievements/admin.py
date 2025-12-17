from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

import achievements.models


class AchievementsAdmin(admin.ModelAdmin):
    list_display = ('title', 'link_to_game', 'description')
    list_display_links = ('title',)

    def link_to_game(self, obj):
        link = reverse("admin:games_games_change", args=[obj.game_id])
        return format_html('<a href="{}">{}</a>', link, obj.game.name)

    link_to_game.allow_tags = True


admin.site.register(achievements.models.Achievements, AchievementsAdmin)
