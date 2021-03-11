import reverso
import cambridge
import howjsay
import google
#import linguee

for i in range(0,40):
    ini = 1001+(i*1000)
    end = 2000+(i*1000)
    dic = 'reverso'

    print(f'limpando {dic} em {ini}-{end}')
    word_list = str(ini)+'-'+str(end)

    dictionary = eval(dic)
    initialize = getattr(dictionary, 'initialize')(dic,word_list)
    start = getattr(dictionary, 'start')()