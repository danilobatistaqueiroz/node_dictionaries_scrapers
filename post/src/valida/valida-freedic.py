import workfiles
import config 

workfiles.word_list = config.word_list
workfiles.dictionary = 'freedic'

def valida_qtd_tabs():
    rd = open (f'../../output/{workfiles.word_list}-{workfiles.dictionary}.csv', 'r')
    counter = 0
    tabs_ok = True
    while True:
        counter+=1
        line = rd.readline()
        if not line :
            break
        if line.count('\t') != 3 :
            tabs_ok = False
            print('tabulacao diferente:'+str(line.count('\t'))+'-'+str(counter))
    rd.close()
    print(f'as tabulacoes estao ok {tabs_ok}')

valida_qtd_tabs()