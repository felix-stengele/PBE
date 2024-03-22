require 'ruby-nfc'

class Rfid
  # Return uid in hexa str
  def read_uid
    NFC::Reader.all[0].poll(Mifare::Classic::Tag) do |tag|
      uid_hex = tag.uid.unpack('H*').first
      return uid_hex
    end
  end
end

if __FILE__ == $0
  rf = Rfid.new
  puts "Apropeu la targeta al lector"
  uid = rf.read_uid
  puts "UID: #{uid}" #unless uid.nil?
end
