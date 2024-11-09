INSTALL_DIR=./ts/node_modules/zkwasm-ts-server/src/application
RUNNING_DIR=./ts/node_modules/zkwasm-ts-server

build:
	wasm-pack build --release --out-name application --out-dir pkg
	wasm-opt -Oz -o $(INSTALL_DIR)/application_bg.wasm pkg/application_bg.wasm
	cp pkg/application_bg.wasm $(INSTALL_DIR)/application_bg.wasm
	cp pkg/application.d.ts $(INSTALL_DIR)/application.d.ts
	#cp pkg/application_bg.js $(INSTALL_DIR)/application_bg.js
	cp pkg/application_bg.wasm.d.ts $(INSTALL_DIR)/application_bg.wasm.d.ts
	cd $(RUNNING_DIR) && npx tsc && cd -

clean:
	rm -rf pkg
	rm -rf $(INSTALL_DIR)/application_bg.wasm
	rm -rf $(INSTALL_DIR)/application.d.ts
	rm -rf $(INSTALL_DIR)/application_bg.js
	rm -rf $(INSTALL_DIR)/application_bg.wasm.d.ts

run:
	node ./ts/node_modules/zkwasm-ts-server/src/service.js

deploy:
	docker build --file ./deploy/service.docker -t zkwasm-server . --network=host
