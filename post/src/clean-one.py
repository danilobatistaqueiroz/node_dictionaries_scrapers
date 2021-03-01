import reverso
import cambridge
import howjsay
import google
import linguee

ini = 7001
end = 8000
dic = 'google'

print(f'limpando {dic} em {ini}-{end}')
word_list = str(ini)+'-'+str(end)
google.initialize(dic,word_list)
google.start()