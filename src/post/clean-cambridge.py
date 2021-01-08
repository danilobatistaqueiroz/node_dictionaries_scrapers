def clean():
    rd = open ('../../output/3001-4000-cambridge.csv', 'r')
    counter = 0
    output = []
    while True:
        counter+=1
        line = rd.readline()
        if not line :
            break
        line = line[:-1]
        fields = line.split('\t')
        ipa = fields[2]
        ipa = ipa.replace('/<span','<span')
        ipa = ipa.replace('</span>/','</span>')
        pt = fields[1]
        pt = pt.replace(',',', ')
        fields[2] = ipa
        fields[1] = pt
        output.append('\t'.join(fields))
    rd.close()
    file = open('../../output/clean/3001-4000-cambridge-clean.csv','w')
    file.write('\n'.join(output))

def validate_cambridge_file():
    rd = open ('../../output/clean/3001-4000-cambridge-clean.csv', 'r')
    while True:
        line = rd.readline()
        if not line :
            break
        if line.count('\t') != 3 :
            word = line[:line.find('\t')]
            print('tabulacao diferente:'+str(line.count('\t'))+'-'+word)
    rd.close()

clean()
validate_cambridge_file()