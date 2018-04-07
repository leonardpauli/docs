#!/bin/sh
scriptname='setup-server.sh'
arg1=${1:-false} # "instance"
instanceUser='mydev'

# helpers
indentations=0
p () { echo "$(printf %$(($indentations * 2))s | tr " " " ")$@"; }


# main
p 'Guide: How to setup (a digitalocean.com) instance (with docker-compose) to run this project'


# on local computer

p '- instance creation'; indentations=$(($indentations+1))
if [ ! "$arg1" = "instance" ]; then
  p 'Is this running on the instance already? (y/N)'; read onInstance
else
  onInstance="y"
fi
if [ ! "$onInstance" = "y" ]; then

  p '- digitalocean.login // open? (Y/n)'; read tmp
  [ ! "$tmp" = "n" ] && open https://cloud.digitalocean.com
  # TODO: use digitalocean api to create droplet?

  p '- droplet.create'; indentations=$(($indentations+1))
  p '- ubuntu 17'
  p '- enable ipv6'
  p '- add your ssh key: Create new? (Y/n)'; read sshKeyNeeded
  if [ ! "$sshKeyNeeded" = "n" ]; then
    indentations=$(($indentations+1))
    if [ ! -f ~/.ssh/id_rsa.pub ]; then
      p '- ssh."generate public/private ssh key pair"'
      [ ! -d ~/.ssh ] && mkdir ~/.ssh && chmod 0700 ~/.ssh
      ssh-keygen -t rsa
    fi

    pubKey="$(cat ~/.ssh/id_rsa.pub)"
    echo "$pubKey" | pbcopy
    p 'Your public ssh key is copied:'
    p "$pubKey"
    p ''
    indentations=$(($indentations-1))
  fi
  indentations=$(($indentations-1))

  p 'optional:'; indentations=$(($indentations+1))
  p '- DNS.point domin name to instance # (DNS -> add A rule: @ -> IP)'
  p '- configure load-balancer'
  indentations=$(($indentations-1))
  
  p 'Enter connected domain name (example.com) or IP: '; read instanceIP

  p '- ssh.user.config.add-remote'; indentations=$(($indentations+1))
  p 'Add entry in ~/.ssh/config? (Y/n)'; read tmp
  if [ ! "$tmp" = "n" ]; then
    { echo "$(cat)" >> ~/.ssh/config ; } <<- EOF
Host $instanceIP
  Hostname $instanceIP
  # User $instanceUser
  ForwardAgent yes
  PubKeyAuthentication yes
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
EOF
    cat ~/.ssh/config
    p ''
    p ''
  fi
  indentations=$(($indentations-1))
  
  p 'Instance setup from local done. To login: '"ssh root@$instanceIP"
  p 'Will now upload this script to instance. ↩︎'; read tmp
  p '...'
  scp ./$scriptname root@$instanceIP:./
  p 'Will now run this script from instance. ↩︎'; read tmp
  p '...'
  ssh root@$instanceIP ./$scriptname instance "$pubKey" ""

  exit 1
fi
indentations=$(($indentations-1))



# on remote instance

p '// on remote'
p ''

p '- ubuntu."fix locale issue" ↩︎'; read tmp # selected alt: prevent remote locale acceptance
sed -i -e 's/^AcceptEnv LANG/# AcceptEnv LANG/' /etc/ssh/sshd_config
systemctl reload sshd

p '- ubuntu."add secure user role" ↩︎'; read tmp; indentations=$(($indentations+1))
instanceUser='mydev'
iuhome="/home/$instanceUser"
adduser $instanceUser && usermod -aG sudo $instanceUser

mkdir $iuhome/.ssh
if [ -z "$pubKey" ]; then
  p 'Paste your "cat ~/.ssh/id_rsa.pub | pbcopy":'; read pubKey
fi
echo "$pubKey" >> $iuhome/.ssh/authorized_keys
chmod 600 $iuhome/.ssh/authorized_keys
chown $instanceUser:$instanceUser $iuhome/.ssh/authorized_keys
indentations=$(($indentations-1))

p '- ubuntu."remove root ssh keys" ↩︎'; read tmp
rm /root/.ssh/authorized_keys

p '- ubuntu."remove server login through password ability" ↩︎'; read tmp
tmp='PasswordAuthentication PubkeyAuthentication ChallengeResponseAuthentication'
for a in $tmp; do sed -i -e 's/^[^#]*'"$a"'/# SEE BOTTOM; \0/g' /etc/ssh/sshd_config; done
echo 'PasswordAuthentication no' >> /etc/ssh/sshd_config
echo 'PubkeyAuthentication yes' >> /etc/ssh/sshd_config
echo 'ChallengeResponseAuthentication no' >> /etc/ssh/sshd_config
cat /etc/ssh/sshd_config | grep Authentication
systemctl reload sshd

p '# - firewall setup? # https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04'

p '- docker."install docker" ↩︎'; read tmp; indentations=$(($indentations+1))
p '- uninstall possibly old versions' \
&& sudo apt-get remove docker docker-engine docker.io \
&& p '- update the apt package index' \
&& sudo apt-get update \
&& sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg2 \
&& p '- add GPG key for official Docker repo' \
&& curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add - \
&& p '- verify that you now have the key with the fingerprint 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88 (better: check docker website):' \
&& p '---' \
&& sudo apt-key fingerprint 0EBFCD88 \
&& p '---' \
&& p '(only continue if there between the lines) ↩︎' \
&& read tmp \
&& p '- add to apt (Advanced Package Tool)' \
&& sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable" \
&& p '- update apt package index (to include newly added repo)' && sudo apt-get update \
&& p '- prioritize newly added repo' && apt-cache policy docker-ce \
&& p '- install docker' && sudo apt-get install -y docker-ce \
&& p '- check status, systemctl used also for auto start on boot' && sudo systemctl status docker \
&& p '- add user to docker group' && sudo usermod -aG docker $USER \
&& p '// done; test by writing "docker" on next login'
# && p '- relogin to apply' && su - ${USER} // not from script
indentations=$(($indentations-1))

p '- docker."install docker-compose" ↩︎'; read tmp; indentations=$(($indentations+1))
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose \
&& sudo chmod +x /usr/local/bin/docker-compose \
&& docker-compose -v # test
indentations=$(($indentations-1))


# p '- docker."install docker-machine"'

p 'done ↩︎'; read tmp
