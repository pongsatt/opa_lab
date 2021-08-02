BUILD_DIR=public
SRC_DIR=policy

rm -rf $BUILD_DIR

mkdir -p $BUILD_DIR
opa build -t rego -o $BUILD_DIR/bundle.tar.gz -b $SRC_DIR

opa build -t wasm -e permission/allow -o $BUILD_DIR/wasm.tar.gz -b $SRC_DIR
tar -xf $BUILD_DIR/wasm.tar.gz -C $BUILD_DIR --exclude=.manifest
