import random

def generate_random_color():
    #Generate a random integer up to 16777215 (0xFFFFFF) 
    #and format it as a 6-digit lowercase hex string padded with zeros
    return f"#{random.randint(0, 0xFFFFFF):06x}"

# Example usage:
print(generate_random_color())