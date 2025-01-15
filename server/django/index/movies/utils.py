from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError

def handle_errors(func):
    def wrapper(self, request, *args, **kwargs):
        try:
            return func(self, request, *args, **kwargs)
        except IntegrityError as error:
            return Response({"error": "Title must be unique" if "unique constraint" in str(error).lower() else "Database error"}, status=400)
        except ValidationError as error:
            return Response({"error": str(error)}, status=400)
        except NotFound as error:
            return Response({"error": str(error)}, status=404)
        except Exception as error:
            return Response({"error": str(error)}, status=500)
    return wrapper