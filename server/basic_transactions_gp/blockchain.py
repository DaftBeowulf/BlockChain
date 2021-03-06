import hashlib
import json
from time import time
from uuid import uuid4
from flask import Flask, jsonify, request
from flask_cors import CORS


DIFFICULTY = 6


class Blockchain(object):
    def __init__(self):
        self.chain = []
        self.current_transactions = []
        # Create the genesis block
        self.new_block(previous_hash='===============', proof=100)

    def new_block(self, proof, previous_hash=None):
        """
        Create a new Block in the Blockchain
        A block should have:
        * Index
        * Timestamp
        * List of current transactions
        * The proof used to mine this block
        * The hash of the previous block
        :param proof: <int> The proof given by the Proof of Work algorithm
        :param previous_hash: (Optional) <str> Hash of previous Block
        :return: <dict> New Block
        """
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1])
        }
        # Reset the current list of transactions
        self.current_transactions = []
        # Append the chain to the block
        self.chain.append(block)
        # Return the new block
        return block

    def hash(self, block):
        """
        Creates a SHA-256 hash of a Block
        :param block": <dict> Block
        "return": <str>
        """
        block_string = json.dumps(block, sort_keys=True).encode()
        hash = hashlib.sha256(block_string).hexdigest()

        return hash

    @property
    def last_block(self):
        return self.chain[-1]

    @staticmethod
    def valid_proof(block_string, proof):
        """
        Validates the Proof:  Does hash(block_string, proof) contain 
        DIFFICULTY number of leading zeroes?  Return true if the proof is valid
        :param block_string: <string> The stringified block to use to
        check in combination with `proof`
        :param proof: <int?> The value that when combined with the
        stringified previous block results in a hash that has the
        correct number of leading zeroes.
        :return: True if the resulting hash is a valid proof, False otherwise
        """
        guess = f'{block_string}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:DIFFICULTY] == "0" * DIFFICULTY

    def new_transaction(self, sender, recipient, amount):
        """
        :param sender: <str> Address of the Recipient
        :param recipient: <str> Address of the Recipient
        :param amount: <int> Amount
        :return: <int> The index of the `block` that will hold this transaction
        """

        self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount
        })

        return self.last_block['index']


# Instantiate our Node
app = Flask(__name__)
CORS(app)
# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')
# Instantiate the Blockchain
blockchain = Blockchain()
@app.route('/mine', methods=['POST'])
def mine():
    data = request.get_json()
    required = ['proof', 'id']
    if not all(k in data for k in required):
        return jsonify({'message': "Both proof and id are required"})

    block_string = json.dumps(blockchain.last_block, sort_keys=True)

    if blockchain.valid_proof(block_string, data['proof']):
        # add new transaction before generating new block
        # gives credit to miner
        blockchain.new_transaction('0', data['id'], 1)

        # a valid proof should fail for all senders except the first
        # forge the new Block by adding it to the chain with the proof,
        # so next time endpoint is hit, will retrieve new last_block
        previous_hash = blockchain.hash(blockchain.last_block)
        blockchain.new_block(data['proof'], previous_hash)

        return jsonify({'message': 'New Block Forged'}), 200
    else:
        return jsonify({'message': 'Proof invalid or already submitted'}), 200


@app.route('/transactions/new', methods=['POST'])
def post_new_transaction():
    data = request.get_json()
    required = ['sender', 'recipient', 'amount']
    if not all(val in data for val in required):
        return jsonify({'message': "Missing values"}), 400

    blockchain.new_transaction(
        data['sender'], data['recipient'], data['amount'])

    response = {
        "block_index": blockchain.last_block['index'],
        "block": blockchain.last_block
    }
    return jsonify(response), 201


@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'length': len(blockchain.chain),
        'chain': blockchain.chain
    }
    return jsonify(response), 200


@app.route('/last_block', methods=['GET'])
def last_block():
    response = {
        'block': blockchain.last_block
    }
    return jsonify(response), 200


# Run the program on port 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
