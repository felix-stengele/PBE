# Proyecto de Lectura de Tarjetas NFC con Ruby

Este es un proyecto universitario para la lectura de uid de tarjetas NFC Mifare utilizando Ruby y la biblioteca 'ruby-nfc' junto al periferico pn532 elechouse.

## Instalación

### 1. Instalar Ruby

Para poder ejecutar el código, necesitarás tener Ruby instalado en tu sistema, para ello usamos el siguiente comando:
`sudo apt-get install ruby-full`

### 2. Instalar la biblioteca 'ruby-nfc'

Para leer tarjetas NFC desde Ruby, utilizaremos la biblioteca [ruby-nfc](https://github.com/hexdigest/ruby-nfc). 
Para poder usar esta libreria necesitaremos las siguientes dependencias:
- libusb: 'sudo apt-get install libusb-dev'
- [libnfc](https://github.com/nfc-tools/libnfc):
  ```bash
  # tar xjvf libnfc-1.7.1.tar.bz2
  # cd libnfc-1.7.1/
  # ./configure
  # make && make install
  ```
-instala [libreefare](https://github.com/nfc-tools/libfreefare):
  - primero tenemos que instalar las siguientes dependencias con:
      `sudo apt-get install autoconf automake git libtool libssol-dev pkg-config`
  - también ejecutaremos el comando `libnfc-pn53x-examples`
  ```bash
  # git clone https://github.com/nfc-tools/libfreefare.git
  # cd libfreefare
  # autoreconf -vis
  # ./configure && make && make install
  ```
  Si te sale el siguiente error:
  ```mifare_key_deriver.c:141:10: error: ‘NMT_BARCODE’ undeclared (first use in this function)
     case NMT_BARCODE:
  ```
  Comenta la línea 195 del archivo 'libfreefare/freefare.c'
  i la línea 142 del archivo 'libfreefare/mifare_key_deriver.c'.

- I, finalmente instalamos [ruby-nfc](https://github.com/hexdigest/ruby-nfc) usando 'gem', el gestor de paquetes de Ruby. Ejecuta el siguiente comando en la terminal:
```bash
sudo gem install ruby-nfc
```

