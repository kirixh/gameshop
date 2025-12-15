from django.contrib import admin

import games.models


class GamesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'category', 'is_published')
    list_display_links = ('name',)
    ordering = ['id']


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title',)
    ordering = ['title']


admin.site.register(games.models.Games, GamesAdmin)
admin.site.register(games.models.Category, CategoryAdmin)
