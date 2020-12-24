def validateFreeDicFile():
    rd = open ('5001-6000-freedic.csv', 'r')

def convertThesaurus():
    out_file = open('5001-6000-freedic.out.csv', 'w')
    out_file.close()
    rd = open ('5001-6000-freedic.csv', 'r')
    while True:
        line = rd.readline()
        if not line :
            break;
        if line.count('\t') == 0 :
            line = '\t'+line

        with open('5001-6000-freedic.out.csv', 'a') as the_file:
            the_file.write(line)
    rd.close()

def validateOutFile():
    rd = open ('5001-6000-freedic.out.csv', 'r')
    while True:
        line = rd.readline()
        if not line :
            break;
        if line.count('\t') != 1 :
            print('tabulacao diferente:'+str(line.count('\t')))
    rd.close()


convertThesaurus()
validateOutFile()