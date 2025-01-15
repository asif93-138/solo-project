from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

def handle_errors(func):
    def wrapper(self, request, *args, **kwargs):
        try:
            return func(self, request, *args, **kwargs)
        except ValidationError as error:
            return Response({"error": str(error)}, status=400)
        except Exception as error:
            return Response({"error": str(error)}, status=500)
    return wrapper
