f = open('./counties/washington.txt', 'r')
a = f.read().split('\n')

print(a)

f.close()