def showSameWordPT():
    rd = open ('5001-6000-full.csv', 'r')
    while True:
        line = rd.readline()
        if not line :
            break
        fst = line.find('\t')
        word = line[:fst]
        snd = line.find('\t',fst+1)
        trd = line.find('\t',snd+1)
        pt = line[snd+1:trd]
        same = pt.find(','+word)
        if same > 0 :
            pt = pt.replace(','+word,'')
            line = line[:snd+1]+pt+line[trd:]
        with open('5001-6000-full.out.csv', 'a') as the_file:
            the_file.write(line)
    rd.close()

showSameWordPT()