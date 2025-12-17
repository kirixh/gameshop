from django.contrib import admin

import users.models


class StatisticsAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'spent_hours', 'updated')
    ordering = ['user', 'game']


admin.site.register(users.models.Statistics, StatisticsAdmin)
