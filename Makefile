frontend: frontend_docker
backend: backend_docker
app: backend_docker frontend_docker

backend_docker:
	@docker build -t backend_server ./backend
	@docker run -dp 4000:4000 --rm --name backend backend_server

frontend_docker:
	@docker build -t frontend_server ./frontend	
	@docker run -dp 3000:3000 --rm --name frontend frontend_server