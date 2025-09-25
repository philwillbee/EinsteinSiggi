#!/usr/bin/env python3
import json
import re
from typing import List, Dict, Any

def filter_requiem_messages(input_file: str, output_file: str) -> None:
    """
    Filter Requiem's messages to only include ones containing specific keywords.
    """
    
    # Keywords to search for (case insensitive)
    keywords = [
        'deliveroo', 'mcdonalds', 'food', 'uber eats', 'just eat', 
        'virtual card', 'discount', 'pizza', 'pasta', 'weed', 'creepy'
    ]
    
    # Requiem's Discord ID
    requiem_id = "859499287816962058"
    
    print(f"Loading Discord data from {input_file}...")
    
    # Load the JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Total messages in file: {len(data['messages'])}")
    
    # Filter messages from Requiem that contain keywords
    filtered_messages = []
    
    for message in data['messages']:
        # Check if message is from Requiem
        if (message.get('author', {}).get('id') == requiem_id and 
            message.get('content') and 
            message.get('content').strip()):
            
            content = message['content'].lower()
            
            # Check if any keyword is in the message content
            for keyword in keywords:
                if keyword.lower() in content:
                    # Keep only essential fields for the bot
                    filtered_message = {
                        'content': message['content'],
                        'timestamp': message['timestamp'],
                        'author': {
                            'nickname': message['author'].get('nickname', 'Requiem')
                        }
                    }
                    filtered_messages.append(filtered_message)
                    print(f"Found message: {message['content'][:50]}...")
                    break
    
    print(f"Found {len(filtered_messages)} matching messages from Requiem")
    
    # Create output structure
    output_data = {
        'messages': filtered_messages,
        'total_count': len(filtered_messages),
        'filter_keywords': keywords,
        'source_author': 'Requiem'
    }
    
    # Save filtered messages
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Filtered messages saved to {output_file}")

if __name__ == "__main__":
    input_file = "attached_assets/Direct Messages - Jack Anthony Roy fan club + Sissification Discussion [976987106905821205] (2023-08-16 to 2025-09-25)_1758809958349.json"
    output_file = "michael_messages.json"
    
    filter_requiem_messages(input_file, output_file)