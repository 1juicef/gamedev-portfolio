import ProjectData from '@/data/ProjectData.ts'

export default [
    new ProjectData("drag-rush", "Drag Rush", "img/projects/project-8-icon.png", `
    <div class="paragraph">
        <strong>Drag Rush</strong> is a rhythm-action racing game set in a sci-fi universe of cosmic bloodsports.
    </div>
    <div class="paragraph">
        Get behind the wheel,<br/>
        Dodge incoming projectiles and obstacles,<br/>
        Go for gold and blow the competition offroad!<br/>
        <br/>
        The only rule?<br/>
        You gotta stick to the beat!
    </div>
    <div class="paragraph center">
        <iframe class="youtube" loading="lazy" src="https://www.youtube.com/embed/L5YWz2i434E" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="paragraph center">
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC1.webp" alt="Drag Rush Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC2.webp" alt="Drag Rush Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC3.webp" alt="Drag Rush Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC4.webp" alt="Drag Rush Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/drag-rush/DragrushSC5.webp" alt="Drag Rush Screenshot" />
    </div>
    <div class="paragraph center">
        <h3>About this game</h3>
        Built in Unity (8 weeks).<br/>
        A team of 6 — 3 programmers, 3 artists.<br/>
        I mainly built the vehicle animation trees and helped finalize the Beat Conductor.<br/>
        Unique twist between a racing- and rhythm game.<br/>
        Fast-paced, satisfying and a "ok, one more try!" hook.
    </div>
    <div class="paragraph center">
        <a href="https://yrgo.itch.io/drag-rush" target="_blank"><img class="itch-badge" src="img/projects/itchBadge.png" alt="Play on itch.io" loading="lazy" /></a>
    </div>
    <details class="tech-overview">
        <summary>Technical Overview</summary>
        <div class="tech-overview-content">
            <div class="tech-snippet">
                <pre><code>void Update()
{
    if (!_running) return;

    double dspTime = AudioSettings.dspTime;

    if (dspTime &gt;= _nextBeatDspTime)
    {
        FireBeat(_nextBeatDspTime);
        _nextBeatDspTime += _beatInterval;
    }
}

public void StartMetronome(double bpm)
{
    _bpm = bpm;
    CalculateInterval();

    _currentBeatInBar = -1;
    _nextBeatDspTime = AudioSettings.dspTime + _beatInterval;
    _running = true;
}</code></pre>
                <p class="tech-caption">Scheduled beats against Unity's AudioSettings.dspTime instead of Time.deltaTime, so the beat clock stays locked to the audio hardware and can't drift out of sync with the music over a long play session.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>IEnumerator DoLaneChange(int newLane, int dir)
{
    _isChangingLane = true;
    _bufferedDir = 0;

    // ...snap to lane, play turn animation, overshoot tween...

    _isChangingLane = false;

    if (_bufferedDir != 0)
    {
        int dirBuf = _bufferedDir;
        _bufferedDir = 0;
        ChangeLane(dirBuf);
    }
}</code></pre>
                <p class="tech-caption">A lane-change input received mid-animation is buffered and replayed once the current turn settles, instead of being dropped or queued in a list — keeps input feel responsive without letting animation state fall out of sync with the logical lane.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>public Tween OvershootTransform(Transform t, float laneX, int dir)
{
    KillActiveTween();

    Vector3 center = new Vector3(laneX, t.position.y, t.position.z);
    t.position = center;

    float goTime = _overshootDuration * 0.45f;
    float backTime = _overshootDuration - goTime;
    float overshootX = laneX + (_overshoot * Mathf.Sign(dir));

    Sequence seq = DOTween.Sequence().SetRecyclable(true);
    seq.Append(t.DOMoveX(overshootX, goTime).SetEase(Ease.OutQuad));
    seq.Append(t.DOMoveX(center.x, backTime).SetEase(Ease.InQuad));
    _activeTween = seq;
    return _activeTween;
}</code></pre>
                <p class="tech-caption">A two-stage tween (fast out past the lane center, slower ease back in) gives the car a sense of momentum on transform position alone — no rigidbody needed for the turn feel.</p>
            </div>
        </div>
    </details>
    `, "#6C3BAA", false, false),
    new ProjectData("dispater", "Dispater", "img/projects/dispater/DispaterSC4.png", `
    <div class="paragraph">
        <strong>"Good morning rookie!"</strong>
    </div>
    <div class="paragraph">
        Are you ready for your first day as the elevator operator at the D.I mining station. The station can be a bit cramped but you should have all you need to guide the rest of your crew through the mines. The Disparator Corporation welcomes you as the newest member of the Disparator family.
    </div>
    <div class="paragraph center">
        <iframe class="youtube" loading="lazy" src="https://www.youtube.com/embed/ihPEcIQ_PwI" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="paragraph center">
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC1.webp" alt="Dispater Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC2.webp" alt="Dispater Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC3.webp" alt="Dispater Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC4.webp" alt="Dispater Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/dispater/DispaterSC5.webp" alt="Dispater Screenshot" />
    </div>
    <div class="paragraph center">
        <h3>About this game</h3>
        Made in Unreal Engine (8 weeks).<br/>
        A team of 7 — 3 programmers, 4 artists.<br/>
        I built the dialogue, task and interaction systems, and did the audio engineering.<br/>
        Heavy narrative.<br/>
        Custom made hexagonal gridbase movement.<br/>
        Atmospheric and creepy environment.<br/>
        Ending will leave you in SHOCK.
    </div>
    <div class="paragraph center">
        <a href="https://yrgo.itch.io/dispater" target="_blank"><img class="itch-badge" src="img/projects/itchBadge.png" alt="Play on itch.io" loading="lazy" /></a>
    </div>
    `, "#6C3BAA", false, false),
    new ProjectData("floor-0", "Floor Zero", "img/projects/project-7-icon.png", `
    <div class="paragraph">
        <strong>Floor Zero</strong> is an atmospheric exploration game set in a derelict underground facility. Navigate through abandoned corridors and discover the mysteries of what happened here.
    </div>
    <div class="paragraph center">
        <video class="pc-video" controls preload="metadata">
            <source src="img/projects/floor-0/Floor0vid2-web.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>
    <div class="paragraph center">
        <img class="pc-screenshot" loading="lazy" src="img/projects/floor-0/Floor0SC1.webp" alt="Floor Zero Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/floor-0/Floor0SC2.webp" alt="Floor Zero Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/floor-0/Floor0SC3.webp" alt="Floor Zero Screenshot" />
        <img class="pc-screenshot" loading="lazy" src="img/projects/floor-0/Floor0SC4.webp" alt="Floor Zero Screenshot" />
    </div>
    <div class="paragraph center">
        <h3>About this game</h3>
        First solo project in Unreal Engine (5 weeks).<br/>
        Multi-state AI built with behaviour tree.<br/>
        Custom built Key/Lock and item system.<br/>
        Guaranteed no sleep for a week minimum.
    </div>
    <div class="paragraph center">
        <a href="https://juice-f.itch.io/floorzero" target="_blank"><img class="itch-badge" src="img/projects/itchBadge.png" alt="Play on itch.io" loading="lazy" /></a>
    </div>
    `, "#6C3BAA", false, false),
    new ProjectData("swing-space", "SwingSpace", "img/projects/swing-space/SwingSpaceGIF.gif", `
    <div class="paragraph">
        Swing yourself up through space by grappling the planets. Get as far as you possible can and beat the highscore!
    </div>
    <div class="paragraph center">
        <video class="pc-video swing-space-video" controls preload="metadata">
            <source src="img/projects/swing-space/SwingSpaceVid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>
    <div class="paragraph center swing-space-shots">
        <img class="pc-screenshot swing-space-shot" loading="lazy" src="img/projects/swing-space/SwingSpaceSC1.webp" alt="SwingSpace Screenshot" />
        <img class="pc-screenshot swing-space-shot" loading="lazy" src="img/projects/swing-space/SwingSpaceSC2.webp" alt="SwingSpace Screenshot" />
    </div>
    <div class="paragraph center">
        <h3>About this game</h3>
        Built in Unity (5 weeks).<br/>
        My first solo project.<br/>
        Firebase integration for global highscore chart.<br/>
        Ported for mobile.<br/>
        Awesome, but also extremely fun.
    </div>
    <details class="tech-overview">
        <summary>Technical Overview</summary>
        <div class="tech-overview-content">
            <div class="tech-snippet">
                <pre><code>void FixedUpdate()
{
    Vector2 currentVelocity = _rb.linearVelocity;
    _rb.linearVelocity = currentVelocity.normalized * _constantSpeed;
    _rb.transform.up = _rb.linearVelocity;
}

void Attach(Rigidbody2D anchor)
{
    _isAttached = true;
    _currentAnchor = anchor;

    _joint = gameObject.AddComponent&lt;DistanceJoint2D&gt;();
    _joint.connectedBody = anchor;
    _joint.enableCollision = false;
    _joint.autoConfigureDistance = false;
    _joint.distance = (_rb.position - anchor.position).magnitude;

    _rb.linearDamping = 0f;
    _rb.angularDamping = 0f;
}</code></pre>
                <p class="tech-caption">Let Unity's DistanceJoint2D handle the swing arc naturally, but renormalized velocity to a constant magnitude every FixedUpdate so gravity and tension can't speed up or slow the swing — keeps the feel consistent regardless of anchor distance.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>void TryAttachNearest()
{
    Collider2D[] hits = Physics2D.OverlapCircleAll(_rb.position, _searchRadius, _anchorLayer);

    Rigidbody2D closestAnchor = null;
    float closestSquaredDistance = float.PositiveInfinity;

    foreach (Collider2D hit in hits)
    {
        float squaredDistance = (hit.attachedRigidbody.position - _rb.position).sqrMagnitude;
        if (squaredDistance &lt; closestSquaredDistance)
        {
            closestSquaredDistance = squaredDistance;
            closestAnchor = hit.attachedRigidbody;
        }
    }

    if (closestAnchor != null)
    {
        Attach(closestAnchor);
        AudioSource.PlayClipAtPoint(_grappleSound, transform.position);
    }
}</code></pre>
                <p class="tech-caption">A layer-filtered overlap query plus squared-distance comparison (no sqrt) keeps grapple targeting cheap and forgiving — the player only has to be roughly aimed at an anchor, not pixel-perfect.</p>
            </div>
            <div class="tech-snippet">
                <pre><code>public event Action&lt;float&gt; OnHeightChanged;
public event Action OnPlayerDeath;

void Start()
{
    // Register this Player with observers
    if (ScoreManager.Instance != null)
        ScoreManager.Instance.SubscribeToPlayerEvents();
    if (FirebaseTest.Instance != null)
        FirebaseTest.Instance.SubscribeToPlayerEvents();
}

public bool PlayerDeath()
{
    if (isKillable == true)
    {
        OnPlayerDeath?.Invoke();
        Destroy(gameObject);
        GameManager.Instance.IsPlayerDead(true);
        AudioSource.PlayClipAtPoint(_deathSFX, transform.position);
        return true;
    }
    return false;
}</code></pre>
                <p class="tech-caption">Player broadcasts height/death via C# events instead of being polled — ScoreManager and the Firebase leaderboard subscribe independently, so scoring stays decoupled from player logic.</p>
            </div>
        </div>
    </details>
    `, "#6C3BAA", false, false)
];