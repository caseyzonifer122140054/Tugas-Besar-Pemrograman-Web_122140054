from setuptools import setup, find_packages

requires = [
    'pyramid',
    'sqlalchemy',
    'psycopg2-binary',
    'pyjwt',
    'pyramid_sockjs',
    'python-dotenv',
    'waitress',
    'passlib',
    'bcrypt',
    'pyramid-apispec',
    'werkzeug',
    'websockets',
    'aiohttp',
    'requests',
]

setup(
    name='travelmate',
    packages=find_packages(),  # <-- ini penting, biar setuptools tahu packages apa yg di-include
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = travelmate.__init__:main',
        ],
    },
)
