import { POST } from '@/app/api/gift-cards/buy/route';

function makeReq(body: unknown): Request {
  return new Request('http://localhost/api/gift-cards/buy', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const validBody = {
  amount: 5000,
  buyer_name: 'Ana',
  buyer_email: 'ana@example.com',
  recipient_name: null,
  recipient_email: null,
  message: null,
};

describe('POST /api/gift-cards/buy', () => {
  afterEach(() => jest.restoreAllMocks());

  it('forwards to the worker with Yoly business_id and returns the url', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ url: 'https://checkout.stripe.com/x', code: 'YOL-AB12' }), { status: 200 }),
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: 'https://checkout.stripe.com/x' });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/pub/gift-cards/buy');
    const sent = JSON.parse((opts as RequestInit).body as string);
    expect(sent.business_id).toBe('5982fadb-48aa-4119-bc18-a61db8733d70');
    expect(sent.amount).toBe(5000);
  });

  it('rejects an amount below 500 without calling the worker', async () => {
    const fetchMock = jest.spyOn(global, 'fetch');
    const res = await POST(makeReq({ ...validBody, amount: 400 }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps worker 409 to not_ready', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'merchant_not_ready' }), { status: 409 }),
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('not_ready');
  });

  it('maps a worker failure to checkout_failed', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'checkout_failed' }), { status: 502 }),
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe('checkout_failed');
  });

  it('maps a network error to checkout_failed', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('boom'));
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe('checkout_failed');
  });
});
