import reverso
import cambridge
import howjsay
import google
import linguee

ini = 1001
end = 2000
dic = 'google'

for i in range(1,41):
    print(f'limpando {dic} em {ini}-{end}')
    word_list = str(ini)+'-'+str(end)
    google.initialize(dic,word_list)
    google.start()
    ini=int(ini)+1000
    end=int(end)+1000
    start_line = 0
    if ini == 41001:
        break
    if end == 41000:
        end = 41284