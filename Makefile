build:
	docker build -t qa:latest .

clean:
	docker rm -f qa

start:
	make clean
	docker run -d --restart unless-stopped --name qa -p 3000:3000 qa:latest

start-rm:
	make clean
	docker run --rm -d --name qa -p 3000:3000 qa:latest

start-cf:
	make start
	cloudflared tunnel run qa
