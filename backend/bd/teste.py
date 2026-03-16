# l = [{"a":{"aa":1, "aaa":2}}, {"b":{"bb":1,"bbb":2}},
#     {"c":{"aa":1, "aaa":2}}, {"d":{"bb":1,"bbb":2}}]

# a = [ k for j in l for k,v in j.items() ]
# print(a)

class Personne: 
    def __init__(self, nom):
        self.__nom = nom 

    def __str__(self):
        return self.__nom + " less man"


a = Personne("toton")
b = str(a)
print(b)
print(type(b))