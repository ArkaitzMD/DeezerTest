from django.contrib import admin
from django.urls import path
from graphene_django.views import GraphQLView

urlpatterns = [
    path("deezer/", GraphQLView.as_view(graphiql=True)),
]
