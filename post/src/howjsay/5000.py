rfile =  open(f'../../../output/5001-6000-howjsay.csv', 'r')
wfile =  open(f'../../out/5001-6000-howjsay.out.csv', 'w')
while True:
    line = rfile.readline()
    if not line :
        break
    terms = line.split('\t')
    word = terms[0]
    mp3 = terms[1]
    mp3 = mp3.replace('sound:','sound:5001-6000/howjsay/')
    newline = word+'\t'+mp3
    wfile.write(newline)
rfile.close()
wfile.close()