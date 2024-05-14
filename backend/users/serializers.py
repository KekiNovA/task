from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db.models import Q


User = get_user_model()  # Use custom model if applicable


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Passwords don't match"})
        return attrs

    def create(self, validated_data):
        if User.objects.filter(email=validated_data['email']).exists():
            raise ValidationError({"email": "Email already exists"})

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs['username']
        password = attrs['password']

        user = User.objects.filter(Q(username=username)).first()
        if not user:
            raise serializers.ValidationError({"error": "Invalid credentials"})

        if not user.check_password(password):
            raise serializers.ValidationError({"error": "Invalid credentials"})

        attrs['user'] = user
        return attrs
