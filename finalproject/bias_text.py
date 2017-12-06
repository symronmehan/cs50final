def main():
    file = open('bias_text', 'r')

    data = file.read()
    array = []
    array = data.split("\n")
    ','.join(map('"{0}"'.format, array))
    return (array_bias)

if __name__ == "__main__":
	main()