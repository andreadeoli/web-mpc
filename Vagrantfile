Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.ssh.forward_agent = true
  config.vm.provision "file", source: "./start.sh", destination: "~/start.sh"
end
