def validaQtdadeTabs():
    rd = open ('6001-7000-freedic.csv', 'r')
    counter = 0
    while True:
        counter+=1
        line = rd.readline()
        if not line :
            break
        if line.count('\t') != 3 :
            print('tabulacao diferente:'+str(line.count('\t'))+'-'+str(counter))
    rd.close()

validaQtdadeTabs()