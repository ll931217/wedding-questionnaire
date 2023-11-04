build:
	docker build -t qa:latest .

start:
	docker rm -f qa
	docker run --rm -d --name qa -p 3000:3000 qa:latest

start-cf:
	make start
	cloudflared tunnel run qa
