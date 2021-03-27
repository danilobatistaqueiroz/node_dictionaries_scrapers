import reverso
import cambridge
import howjsay
import google
#import linguee

dic = 'google'

print(f'limpando {dic}')
word_list = dic+'words'

dictionary = eval(dic)
initialize = getattr(dictionary, 'initialize')(dic,word_list)
start = getattr(dictionary, 'start')()