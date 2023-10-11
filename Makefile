build:
	docker build -t qa:latest .

start:
	docker run --rm -d --name qa -p 3000:3000 qa:latest
	cloudflared tunnel run qa
