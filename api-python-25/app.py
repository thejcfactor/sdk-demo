from service.sdk_demo_service import service

#gunicorn -b 0.0.0.0:8000 app
#will work with below line, it is looking for "application"
application = service
#gunicorn -b 0.0.0.0:8000 app:service
#with below line need to tell gunicorn what to use for application
#service = service
if __name__ == '__main__':
    application.run()