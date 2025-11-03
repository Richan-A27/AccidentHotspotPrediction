import requests

API_KEY = "fe1bfbfaa80d4e20dc759483f742908d"


def get_live_weather(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    r = requests.get(url).json()
    weather = r["weather"][0]["main"]
    temp = r["main"]["temp"]
    return weather, temp

if __name__ == "__main__":
    print(get_live_weather(13.0674, 80.2376))
