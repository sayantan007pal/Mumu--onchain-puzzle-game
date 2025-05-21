import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_move(client):
    resp = client.post('/move', json={
        'grid': [[0, 1], [1, 0]],
        'width': 2,
        'height': 2,
        'x': 0,
        'y': 0,
        'direction': 1
    })
    assert resp.status_code == 200
    assert 'grid' in resp.get_json()

def test_apply_formula(client):
    resp = client.post('/apply_formula', json={
        'grid': [[0, 1], [1, 0]],
        'width': 2,
        'height': 2,
        'formula': {'input': 1, 'output': 2}
    })
    assert resp.status_code == 200
    assert 'grid' in resp.get_json()

def test_check_completion(client):
    resp = client.post('/check_completion', json={
        'grid': [[1, 1], [1, 1]],
        'target': [[1, 1], [1, 1]]
    })
    assert resp.status_code == 200
    assert 'completed' in resp.get_json()

def test_health(client):
    resp = client.get('/health')
    assert resp.status_code == 200
    assert resp.get_json() == {'status': 'ok'}

def test_toggle_mock(client):
    resp = client.post('/toggle_mock', json={'mock': True})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['mock'] is True
    assert 'Mock mode toggled' in data['message']
