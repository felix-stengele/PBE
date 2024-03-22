require "gtk3"
require_relative "puzzle1"

#initialize Gtk window
window = Gtk::Window.new("rfid_gtk.rb")
window.set_size_request(100, 200)
window.set_border_width(20)

#add CSS code for rounded corners and better font size as this is not implemented in gtk3
css_provider = Gtk::CssProvider.new
css_provider.load(data: <<-CSS)
label, button {
  font-family: "Arial Bold";
  border-radius: 10px;
  padding: 10px;
  font-size: 18px;
  font-weight: 800;
}
CSS

#define colors
@blue = Gdk::RGBA::new(0, 0, 1.0, 1.0)
@red = Gdk::RGBA::new(1.0, 0, 0, 1.0)
@white = Gdk::RGBA::new(1.0, 1.0, 1.0, 1.0)

#initialize label and set start colors
label = Gtk::Label.new("Please, log in with your university card")
label.override_background_color(0, @blue)
label.override_color(0, @white)
label.set_size_request(80,100)

#initialize button and set text on button
button = Gtk::Button.new(:label => "clear")

#initialize Rfid object
rf = Rfid.new

# Function to change the label text
def change_text(label, new_text, color)
  label.set_text(new_text)
  label.override_background_color(0, color);
end

# Function to start a new thread to read uid
def read(rf, label)
  Thread.new do
    uid = rf.read_uid
    GLib::Idle.add do
      change_text(label, "uid: " + uid.upcase , @red)
      GLib::Source::REMOVE
    end
  end
end

read(rf, label)

button.signal_connect "clicked" do
  change_text(label, "Please, log in with your university card", @blue)
  read(rf, label)
end

#use a box to add more than one widget to the window
box = Gtk::Box.new(:vertical, 5)
box.add(label)
box.add(button)

#add the box to the window
window.add(box)

#add option to close window
window.signal_connect("delete-event") { Gtk.main_quit }

#add the css code to the label and button as the method add_provider_for_screen which we could
#apply to the whole box is not implemented in gtk3 for ruby
label.style_context.add_provider(css_provider, Gtk::StyleProvider::PRIORITY_USER)
button.style_context.add_provider(css_provider, Gtk::StyleProvider::PRIORITY_USER)

#show the window
window.show_all

Gtk.main
