require "gtk3"
require_relative "puzzle1"

window = Gtk::Window.new("RFID")
window.set_size_request(400, 100)
window.set_border_width(10)

label = Gtk::Label.new("Please, log in with your university card")

button = Gtk::Button.new(:label => "clear") # Changed label text on button

rf = Rfid.new

# Function to change the label text
def change_text(label, new_text)
  label.set_text(new_text)
end

# Function to 
def read(rf, label)
  Thread.new do
    uid = rf.read_uid
    GLib::Idle.add do
      change_text(label, uid)
      GLib::Source::REMOVE
    end
  end
end

read(rf, label)

button.signal_connect "clicked" do
  change_text(label, "Please, log in with your university car")
  read(rf, label)
end

box = Gtk::Box.new(:vertical, 5)
box.add(label)
box.add(button)

window.add(box)
window.signal_connect("delete-event") { Gtk.main_quit }
window.show_all

Gtk.main
