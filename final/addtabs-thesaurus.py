def convertThesaurus():
    out_file = open('5001-6000-thesaurus.out.csv', 'w')
    out_file.close()
    rd = open ('5001-6000-thesaurus.csv', 'r')
    while True:
        line = rd.readline()
        if not line :
            break;
        if line.count('\t') == 5 :
            index = line.find('[sound:')
            line = line[:index] + '\t\t\t\t' + line[index:]

        with open('5001-6000-thesaurus.out.csv', 'a') as the_file:
            the_file.write(line)
    rd.close()

def validateOutFile():
    rd = open ('5001-6000-thesaurus.out.csv', 'r')
    while True:
        line = rd.readline()
        if not line :
            break;
        if line.count('\t') != 9 :
            word = line[:line.find('\t')]
            print('tabulacao diferente:'+str(line.count('\t'))+'-'+word)
    rd.close()


convertThesaurus()
validateOutFile()