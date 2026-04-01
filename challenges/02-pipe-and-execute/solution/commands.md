# Challenge 02 — Solutions

## Step 2 — Extract the Content

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"model": "openrouter/free",
       "reasoning": {"exclude": true},
       "messages": [{
         "role": "user",
         "content": "Return only mac bash command to take a screenshot. Output raw string only"
        }]
      }' \
| jq -r '.choices[0].message.content'
```

## Step 3 — Execute It

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"model": "openrouter/free",
       "reasoning": {"exclude": true},
       "messages": [{
         "role": "user",
         "content": "Return only mac bash command to take a screenshot. Output raw string only"
        }]
      }' \
| jq -r '.choices[0].message.content' \
| bash
```
