from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, serializers
from .serializers import SignupSerializer, LoginSerializer
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model


User = get_user_model()


class SignupView(APIView):
    '''
    This view is used to signup the user.

    Parameters:
    username(string): Username of the user.
    email(string)(optional): Email of the user.
    password(string): Password of the user.
    password2(string): Confirm password.

    Returns:
    message: Success message.
    '''
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=SignupSerializer,
                         responses={201: '''When user is created successfully''',
                                    400: '''Gives Validation Error''',
                                    500: '''Internal Server Error'''})
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
            return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'errors': e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    '''
    This view is used to login the user.

    Parameters:
    username(string): Username of the user.
    password(string): Password of the user.

    Returns:
    token: Auth Token of user
    '''
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=LoginSerializer,
                         responses={201: '''When user is successfully logged in. return token''',
                                    400: '''Gives Validation Error''',
                                    401: '''Gives invalid username error''',
                                    500: '''Internal Server Error'''}
                         )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)

        except (ValidationError, serializers.ValidationError) as e:
            return Response({'errors': e.args[0]}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
