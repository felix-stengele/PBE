# Proyecto de Lectura de Tarjetas NFC con Ruby

Este es un proyecto universitario para la lectura de uid de tarjetas NFC Mifare utilizando Ruby y la biblioteca `ruby-nfc` junto al periferico pn532 elechouse.

## Instalación

### 1. Instalar Ruby

Para poder ejecutar el código, necesitarás tener Ruby instalado en tu sistema, para ello usamos el siguiente comando:
'sudo apt-get install ruby-full'

### 2. Instalar la biblioteca ruby-nfc

Para leer tarjetas NFC desde Ruby, utilizaremos la biblioteca [ruby-nfc](). 
Para poder usar esta libreria necesitaremos las siguientes dependencias:
- libusb: 'sudo apt-get install libusb-dev'
- [libnfc](): '''
  # tar xjvf libnfc-1.7.1.tar.bz2
  # cd libnfc-1.7.1/
  # ./configure
  # make && make install'''

Puedes instalarla fácilmente usando `gem`, el gestor de paquetes de Ruby. Ejecuta el siguiente comando en la terminal:
'sudo gem install ruby-nfc'


```bash
gem install ruby-nfc

