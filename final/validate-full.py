def validateFullFile():
    rd = open ('5001-6000-full.csv', 'r')
    while True:
        line = rd.readline()
        if not line :
            break
        if line.count('\t') != 17 :
            word = line[:line.find('\t')]
            print('tabulacao diferente:'+str(line.count('\t'))+'-'+word)
    rd.close()

def validateCambridgeFile():
    rd = open ('5001-6000-cambridge.csv', 'r')
    while True:
        line = rd.readline()
        if not line :
            break
        if line.count('\t') != 3 :
            word = line[:line.find('\t')]
            print('tabulacao diferente:'+str(line.count('\t'))+'-'+word)
    rd.close()

def validateFreeDicFile():
    rd = open ('5001-6000-freedic.csv', 'r')
    while True:
        line = rd.readline()
        if not line :
            break
        #if line.count('\t') != 3 :
        print('tabulacao diferente:'+str(line.count('\t')))
    rd.close()

validateFullFile()
#validateCambridgeFile()
#validateFreeDicFile()